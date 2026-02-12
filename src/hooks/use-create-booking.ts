import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { CreateBookingInput } from "@/lib/validators/booking.schema";

export function useCreateBooking() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            
        }
    })
}
