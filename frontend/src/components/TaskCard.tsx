interface TaskCardProps {
  task: any;
  onDelete: (id: string) => void;
  onEdit: (task: any) => void;
}

export default function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
const { _id, title, description, status } = task;
  const color =
    status === "completed"
      ? "bg-green-100 text-green-700"
      : status === "in-progress"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="border rounded-xl p-5 shadow-sm bg-white flex justify-between items-start transform transition hover:scale-[1.01] hover:shadow-md duration-200">
      {/* Left side: title + desc + status */}
      <div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>

        {description && (
          <p className="text-gray-600 text-sm mb-2">{description}</p>
        )}

        <span className={`px-3 py-1 rounded-xl text-sm capitalize ${color}`}>
          {status}
        </span>
      </div>

      {/* Right side: edit + delete */}
      <div className="flex gap-2">
        <button
          className="px-3 py-1 text-white bg-blue-500 rounded-lg"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          className="px-3 py-1 text-white bg-red-500 rounded-lg"
          onClick={() => onDelete(_id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
