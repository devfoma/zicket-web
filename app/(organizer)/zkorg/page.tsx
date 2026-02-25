export default async function ZkorgPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v } = await searchParams;
  const state = v || 'overview';

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold capitalize">{state} State</h1>
      <p className="text-gray-600 mt-2">
        This is the {state} version of the organizer dashboard.
      </p>
    </div>
  );
}
