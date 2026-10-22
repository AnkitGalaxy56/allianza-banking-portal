import type { SvgIconComponent } from '@mui/icons-material';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import type { StatIcon } from '@/types/dashboard';

export const STAT_ICONS: Record<StatIcon, SvgIconComponent> = {
  branches: AccountBalanceOutlinedIcon,
  customers: PeopleAltOutlinedIcon,
  requests: DescriptionOutlinedIcon,
  notifications: NotificationsNoneOutlinedIcon,
  banks: AccountBalanceOutlinedIcon,
  users: PhoneAndroidOutlinedIcon,
  accounts: AccountBalanceWalletOutlinedIcon,
  loans: AttachMoneyOutlinedIcon,
};
