function Approvers({ approvers }) {
  return (
    <div className="border p-4 rounded-lg bg-grey mb-4">
      <h3 className="text-lg font-semibold mb-4">Approvers</h3>
      <div className="flex flex-wrap justify-start gap-4">
        {approvers.map((approver, index) => (
          <div key={approver?.id}>
            <span className="font-medium text-sm text-primary">Approver #{index + 1}</span>
            <div
              className="flex flex-col items-start border px-4 py-3 rounded-lg bg-white w-48 mt-1"
            >
              <span>{approver?.user_name}</span>
              <span className="font-medium text-sm text-primary">{approver?.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Approvers;
