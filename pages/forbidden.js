const Forbidden = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-red-600 mb-4">403 Forbidden</h1>
                <p className="text-lg text-default_text">You don&apos;t have access to this page.</p>
            </div>
        </div>
    );
};

export default Forbidden;
