import { ModalBody, ModalContent, ModalHeader, ModalFooter, Skeleton } from "@heroui/react";

const LoadingDetailKamar = () => {
  return (
    <ModalContent className="overflow-hidden">
      <ModalHeader className="border-b pb-3 border-neutral-700">
        <Skeleton className="h-6 w-3/4 rounded-lg" />
      </ModalHeader>
      
      <ModalBody className="px-0 pt-0">
        <div className="w-full h-64 sm:h-80">
          <Skeleton className="w-full h-full" />
        </div>
        
        <div className="px-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </ModalBody>
      
      <ModalFooter className="border-t border-neutral-700">
        <Skeleton className="h-10 w-24 rounded-md" />
      </ModalFooter>
    </ModalContent>
  )
}

export default LoadingDetailKamar