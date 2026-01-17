import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const PostArenaForm = () => {
  return (
    <div className="w-full p-4  bg-white">
      <form className="space-y-2">
        <FormField label="Name" />
        <FormField label="Description" />
        <FormField label="Price" />
        <div className="flex flex-row justify-between items-center gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <Label>Open-time</Label>
            <Input type="time" defaultValue="09:00" />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <Label>Open-time</Label>
            <Input type="time" defaultValue="18:00" />
          </div>
        </div>
      </form>
    </div>
  );
};
