const SearchBox = () => {
  return (
    <div className="w-full max-w-4xl">
      <input
        type="text"
        placeholder="What do you feel like playing today?"
        className="w-full h-12 px-5 py-2 border border-gray-300 rounded-full text-base text-white bg-gray-300/40 outline-none"
      />
    </div>
  );
};

export default SearchBox;
