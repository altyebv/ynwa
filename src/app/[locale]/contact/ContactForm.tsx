'use client';

import { useActionState, useId } from 'react';
import { useTranslations } from 'next-intl';
import { submitEnquiry, type EnquiryState, type FieldName } from './actions';
import { Button } from '@/components/ui/Button';
import { channel, channelHref } from '@/content/company';
import { cn } from '@/lib/cn';

const initial: EnquiryState = { status: 'idle' };

const fieldStyles =
  'w-full rounded-xs border bg-paper px-3 py-2.5 type-body text-fg ' +
  'transition-colors duration-200 placeholder:text-fg-20 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text';

/**
 * The enquiry form.
 *
 * Built on React's own form action state rather than a form library: the
 * server action already owns validation, `useActionState` already gives back
 * pending state and the last result, and the fields are uncontrolled — which
 * means the whole thing works with JavaScript disabled and needs no client
 * state at all. A form library here would add a dependency and a second copy
 * of the rules.
 *
 * The server returns error CODES, not sentences. The wording lives in the
 * message files, so validation speaks Arabic on the Arabic page without the
 * action knowing which locale it is serving.
 */
export function ContactForm() {
  const t = useTranslations('contactPage');
  const [state, formAction, pending] = useActionState(submitEnquiry, initial);
  const id = useId();
  const email = channel('email');
  const office = channel('phone');

  const errorFor = (field: FieldName) =>
    state.status === 'invalid' ? state.fieldErrors?.[field] : undefined;

  if (state.status === 'success') {
    return (
      <div
        role="status"
        className="border border-detail bg-detail-wash p-8"
      >
        <p className="type-eyebrow text-detail-text">{t('successEyebrow')}</p>
        <p className="mt-4 type-display-3">{t('successTitle')}</p>
        <p className="mt-3 type-small text-fg-60">{t('successBody')}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {/* Not display:none — some bots skip hidden inputs. Off-canvas, out of
          the tab order, and announced to nobody. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${id}-website`}>{t('honeypotLabel')}</label>
        <input
          id={`${id}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <Field
        id={`${id}-name`}
        name="name"
        label={t('nameLabel')}
        error={errorFor('name')}
        defaultValue={state.values?.name}
        autoComplete="name"
        required
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id={`${id}-email`}
          name="email"
          type="email"
          dir="ltr"
          label={t('emailLabel')}
          error={errorFor('email')}
          defaultValue={state.values?.email}
          autoComplete="email"
          required
        />
        <Field
          id={`${id}-phone`}
          name="phone"
          type="tel"
          dir="ltr"
          label={t('phoneLabel')}
          hint={t('optional')}
          error={errorFor('phone')}
          defaultValue={state.values?.phone}
          autoComplete="tel"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-stage`} className="type-eyebrow text-fg-60">
          {t('stageLabel')}
        </label>
        <select
          id={`${id}-stage`}
          name="stage"
          defaultValue={state.values?.stage || 'unsure'}
          className={cn(fieldStyles, 'border-fg/20 h-11')}
        >
          <option value="start">{t('stageStart')}</option>
          <option value="operate">{t('stageOperate')}</option>
          <option value="grow">{t('stageGrow')}</option>
          <option value="unsure">{t('stageUnsure')}</option>
        </select>
      </div>

      <Field
        id={`${id}-message`}
        name="message"
        label={t('messageLabel')}
        hint={t('messageHint')}
        error={errorFor('message')}
        defaultValue={state.values?.message}
        multiline
        required
      />

      {/* The two failures that are ours, not the visitor's. Both hand them a
          channel that works right now rather than asking them to try again. */}
      {(state.status === 'unconfigured' || state.status === 'error') && (
        <p
          role="alert"
          className="border-s-2 border-critical bg-raised p-4 type-small text-fg"
        >
          {t(state.status === 'unconfigured' ? 'notConnected' : 'sendFailed')}{' '}
          {email && (
            <a
              href={channelHref(email)}
              className="underline underline-offset-4 hover:text-accent-text"
            >
              {email.display}
            </a>
          )}
          {office && (
            <>
              {' · '}
              <a
                href={channelHref(office)}
                dir="ltr"
                className="underline underline-offset-4 hover:text-accent-text"
              >
                {office.display}
              </a>
            </>
          )}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? t('sending') : t('submit')}
        </Button>
        <p className="type-small text-fg-40">{t('privacyNote')}</p>
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  hint,
  error,
  multiline,
  ...rest
}: {
  id: string;
  name: FieldName;
  label: string;
  hint?: string;
  error?: string;
  multiline?: boolean;
  type?: string;
  dir?: 'ltr' | 'rtl';
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
}) {
  const t = useTranslations('contactPage.errors');
  const describedBy = error ? `${id}-error` : undefined;
  const className = cn(fieldStyles, error ? 'border-critical' : 'border-fg/20');

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex items-baseline gap-2 type-eyebrow text-fg-60">
        {label}
        {hint && <span className="text-fg-40 normal-case">{hint}</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={6}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(className, 'resize-y')}
          {...rest}
        />
      ) : (
        <input
          id={id}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={className}
          {...rest}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="type-small text-critical">
          {t(error)}
        </p>
      )}
    </div>
  );
}
