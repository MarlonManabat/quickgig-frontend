export default function Page(){
  // Use different copy so getByText('Post a job') only matches the nav link
  return <div data-testid="post-job-skeleton">Create a job (placeholder)</div>;
}
