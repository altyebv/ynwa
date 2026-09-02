import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/** Locale-aware replacements for next/link and next/navigation.
 *  Importing next/link directly is banned by ESLint. */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
