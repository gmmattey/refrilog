export function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <img
        src="/mascot.jpg"
        alt=""
        className="mb-3 size-28 object-contain"
      />
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
