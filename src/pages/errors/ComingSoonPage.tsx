import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import PageHeader from '@/components/common/PageHeader';
import StatusPage from './StatusPage';

/** Placeholder for menu items whose screens are not built yet. */
export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <>
      <PageHeader title={title} />
      <StatusPage
        title="Coming soon"
        message={`The ${title} screen is not built yet.`}
        icon={<ConstructionOutlinedIcon fontSize="large" />}
      />
    </>
  );
}
