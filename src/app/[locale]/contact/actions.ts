'use server';

import { z } from 'zod';

/**
 * Where an enquiry actually goes.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * READ THIS BEFORE LAUNCH. Nobody has told us where enquiries should land —
 * it is one of the outstanding client questions. Rather than pretend, this
 * action refuses to accept a submission unless a destination is configured,
 * and the form then tells the visitor to phone or email instead. A form that
 * silently swallows enquiries is the worst possible failure for a business
 * whose entire proposition is "we will handle this for you", so the failure
 * is made loud and the fallback is a real channel.
 *
 * To connect it: set ENQUIRY_WEBHOOK_URL in the environment (see .env.example)
 * to whatever receives enquiries — a form service, a CRM inbound hook, an
 * internal endpoint. That is the only change needed here.
 * ────────────────────────────────────────────────────────────────────────────
 */
const destination = process.env.ENQUIRY_WEBHOOK_URL?.trim();

/** Error codes, not sentences. The client owns the wording, in two languages. */
export type FieldError = 'required' | 'invalid' | 'tooShort' | 'tooLong';
export type FieldName = 'name' | 'email' | 'phone' | 'stage' | 'message';

export interface EnquiryState {
  status: 'idle' | 'success' | 'invalid' | 'unconfigured' | 'error';
  fieldErrors?: Partial<Record<FieldName, FieldError>>;
  /** Echoed back so a rejected submission does not empty the form. */
  values?: Partial<Record<FieldName, string>>;
}

const schema = z.object({
  name: z.string().trim().min(2, 'tooShort').max(120, 'tooLong'),
  email: z.email('invalid').max(200, 'tooLong'),
  phone: z.string().trim().max(40, 'tooLong'),
  stage: z.enum(['start', 'operate', 'grow', 'unsure']),
  message: z.string().trim().min(10, 'tooShort').max(4000, 'tooLong'),
});

export async function submitEnquiry(
  _previous: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  // Honeypot. A field no human sees and every naive bot fills in. Returning
  // success rather than an error means the bot has no signal to adapt to.
  if (String(formData.get('website') ?? '') !== '') {
    return { status: 'success' };
  }

  const values = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    stage: String(formData.get('stage') ?? ''),
    message: String(formData.get('message') ?? ''),
  };

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<FieldName, FieldError>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as FieldName;
      if (fieldErrors[field]) continue;
      // An empty required field is "we need this", not "that is too short" or
      // "that does not look right" — zod cannot tell the difference from a
      // min-length rule, so decide it here from what was actually submitted.
      if (values[field]?.trim() === '') {
        fieldErrors[field] = 'required';
        continue;
      }
      const known: FieldError[] = ['required', 'invalid', 'tooShort', 'tooLong'];
      fieldErrors[field] = known.includes(issue.message as FieldError)
        ? (issue.message as FieldError)
        : 'invalid';
    }
    return { status: 'invalid', fieldErrors, values };
  }

  if (!destination) {
    console.error(
      '[ynwa] An enquiry was submitted and could not be delivered: ' +
        'ENQUIRY_WEBHOOK_URL is not set. See src/app/[locale]/contact/actions.ts.',
    );
    return { status: 'unconfigured', values };
  }

  try {
    const response = await fetch(destination, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...parsed.data, receivedAt: new Date().toISOString() }),
    });
    if (!response.ok) throw new Error(`destination responded ${response.status}`);
  } catch (error) {
    console.error('[ynwa] Enquiry delivery failed:', error);
    return { status: 'error', values };
  }

  return { status: 'success' };
}
