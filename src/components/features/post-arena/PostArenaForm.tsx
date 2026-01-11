import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const PostArenaForm = () => {
  return (
    <div className="w-full p-4 border border-black bg-white">
      <form>
        <Label>name</Label>
        <Input type="text" placeholder="Enter your arena name" />

        <Label>name</Label>
        <Input type="text" placeholder="Enter your arena name" />
      </form>
    </div>
  );
};
