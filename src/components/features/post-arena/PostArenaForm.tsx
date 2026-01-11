import { Input } from "@/components/ui/input";
import {Label} from "@/components/ui/label"

export const PostArenaForm = () => {
  return (
    <div>
      <form>
        <Label>name</Label>
        <Input type="text" placeholder="Enter your arena name"/>
      </form>
    </div>
  );
};
