export default function EmailField({
  value,
  onChange,
  id = "email",
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  id?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm mb-1">
        Email
      </label>
      <input
        id={id}
        type="email"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded p-2"
        aria-describedby={error ? `${id}-err` : undefined}
      />
      {error && (
        <p id={`${id}-err`} className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
