export interface ReviewItem {
  name: string;
  role: string;
  company: string;
  rating: number;
  comment: string;
  metric: string;
  metricLabel: string;
}

export const TESTIMONIALS: ReviewItem[] = [
  {
    name: "David Chen",
    role: "VP of Sales",
    company: "CloudSys",
    rating: 5,
    comment: "We deployed Tapfolio Metal to our entire enterprise sales floor. Within 3 months, our CRM captured 120+ highly qualified leads directly from the NFC tap integration.",
    metric: "120+",
    metricLabel: "Qualified Leads"
  },
  {
    name: "Elena Rodriguez",
    role: "Principal",
    company: "ArchStudio",
    rating: 5,
    comment: "Our agency used to spend thousands annually reprinting paper cards every time someone's title changed. Now, we update it globally in the Tapfolio dashboard in 2 seconds.",
    metric: "$0",
    metricLabel: "Printing Costs"
  }
];
