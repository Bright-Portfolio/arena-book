import { FC, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CldImage } from "next-cloudinary";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface ImageUploadAreaProps {
  imageUrls: string[];
  onChange: (urls: string[]) => void;
  onUploadingChange?: (isUploading: boolean) => void;
}

// Sortable thumnail item
const SortableItem = ({
  url,
  index,
  onRemove,
}: {
  url: string;
  index: number;
  onRemove: (index: number) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`shrink-0 relative w-[200px] h-[200px] ${isDragging ? "opacity-80" : ""}`}
      {...attributes}
      {...listeners}
    >
      <CldImage
        alt={`arena-image-${index}`}
        src={url}
        width={200}
        height={200}
        crop="fill"
        gravity="auto"
        className="w-full h-full rounded-lg object-cover pointer-events-none"
      />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        className="absolute -top-2 -right-2 bg-white rounded-full shadow-md cursor-pointer"
        title="Remove image"
      >
        <XCircleIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

// Main component
export const ImageUploadArea: FC<ImageUploadAreaProps> = ({
  imageUrls,
  onChange,
  onUploadingChange,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  // Dropzone
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
    onDrop: async (files) => {
      setIsUploading(true);
      onUploadingChange?.(true);
      try {
        const urls = await Promise.all(files.map(uploadToCloudinary));
        onChange([...imageUrls, ...urls]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsUploading(false);
        onUploadingChange?.(false);
      }
    },
  });

  //   DnD kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = imageUrls.indexOf(active.id as string);
      const newIndex = imageUrls.indexOf(over.id as string);
      onChange(arrayMove(imageUrls, oldIndex, newIndex));
    }
  }

  function handleRemove(index: number) {
    onChange(imageUrls.filter((_, i) => i !== index));
  }

  return (
    <div
      {...getRootProps()}
      className={`border rounded-md p-4 cursor-pointer hover:border-gray-400 transition-colors ${isDragActive ? "ring-[1px] ring-input bg-gray-50" : "border-gray-300"}`}
    >
      <input {...getInputProps()} />
      {imageUrls.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={imageUrls} strategy={rectSortingStrategy}>
            <div className="flex flex-row gap-2 overflow-x-auto pt-2">
              {imageUrls.map((url, index) => (
                <SortableItem
                  key={url}
                  url={url}
                  index={index}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Drop hint + browse button */}
      <div className="flex flex-col  items-center gap-2 py-4">
        {imageUrls.length === 0 && (
          <p className="text-sm text-gray-300">
            {isUploading
              ? "Uploading..."
              : isDragActive
                ? "Drop images here..."
                : "drag & drop images here"}
          </p>
        )}

        <button
          type="button"
          onClick={open}
          className="px-2 py-1 text-sm text-gray-300 border border-gray-200 rounded-md cursor-pointer hover:border-gray-400 hover:text-gray-400 transition-colors"
        >
          Browse Files
        </button>
      </div>
    </div>
  );
};
