/**
 * Allianza (Super Admin) User Management entry point.
 * The same bank-user management UI is intentionally reused for now.
 * Allianza-specific fields and behaviour can be introduced here later
 * without changing the bank administration page.
 */
import BankUsersPage from '../bank/BankUsersPage';

export default function AllianzaUsersPage() {
  return <BankUsersPage />;
}
