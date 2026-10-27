export type BannerStatus = 'active' | 'in_review' | 'inactive';
export interface Banner {
  title: string;
  scope: string;
  status: BannerStatus;
  tone: string;
  announcementText?: string;
}
