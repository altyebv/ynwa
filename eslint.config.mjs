import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/**
 * Physical-direction Tailwind utilities are banned project-wide.
 *
 * The site ships in English (LTR) and Arabic (RTL) from the same components.
 * `pl-6` is correct in one direction and wrong in the other; `ps-6` is correct
 * in both. Catching this at lint time is the difference between RTL being a
 * property of the codebase and RTL being an audit someone has to remember to run.
 *
 * Physical -> logical:
 *   pl-*  -> ps-*        ml-*         -> ms-*
 *   pr-*  -> pe-*        mr-*         -> me-*
 *   left-*  -> start-*   right-*      -> end-*
 *   border-l -> border-s rounded-l-*  -> rounded-s-*
 *   text-left -> text-start           text-right -> text-end
 */
const PHYSICAL = String.raw`(^|[\s:])-?(pl|pr|ml|mr|left|right|border-l|border-r|rounded-l|rounded-r|rounded-tl|rounded-tr|rounded-bl|rounded-br|float-left|float-right|clear-left|clear-right|text-left|text-right|origin-left|origin-right|scroll-pl|scroll-pr|scroll-ml|scroll-mr)(-|:|\s|$)`;

const RTL_MESSAGE =
  'Physical direction utility found. Use the logical equivalent (ps/pe, ms/me, start/end, border-s/border-e, text-start/text-end) so the component mirrors correctly in Arabic. See eslint.config.mjs for the full mapping.';

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: `JSXAttribute[name.name='className'] Literal[value=/${PHYSICAL}/]`,
          message: RTL_MESSAGE,
        },
        {
          selector: `JSXAttribute[name.name='className'] TemplateElement[value.raw=/${PHYSICAL}/]`,
          message: RTL_MESSAGE,
        },
        {
          selector: "ImportDeclaration[source.value='next/link']",
          message:
            "Import { Link } from '@/i18n/navigation' instead of next/link, so every href carries the active locale.",
        },
      ],
    },
  },
  {
    files: ['src/i18n/navigation.ts'],
    rules: { 'no-restricted-syntax': 'off' },
  },
  { ignores: ['.next/**', 'node_modules/**', 'out/**', 'next-env.d.ts'] },
];

export default eslintConfig;
