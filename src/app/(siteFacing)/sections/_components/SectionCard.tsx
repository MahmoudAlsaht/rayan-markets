'use client'
import Image from "next/image";
import { LoadingLink } from "@/app/(siteFacing)/_context/LoadingContext";

export type SectionCardProps = {
  id: string;
  name: string;
  type: string;
  cover: {
    path: string;
  } | null;
};

export default function SectionCard({
  section,
}: {
  section: SectionCardProps;
}) {
    const [showName, setShowName] = useState(false); 
  
   const handleShowName = () => setShowName(true); 
   const handleHideName = () => setShowName(false); 
  
   return ( 
     <Card 
       className="rounded-3xl bg-inherit" 
       onMouseOver={handleShowName} 
       onMouseLeave={handleHideName} 
     > 
       <LoadingLink href={`/sections/${section.type}/${section.id}`}> 
         <CardContent className="relative flex aspect-square w-full items-center justify-center p-6"> 
           <Image 
             fill 
             className="rounded-3xl" 
             src={ 
               section.cover?.path.replace("/upload", "/upload/w_200") as string 
             } 
             alt={`${section.name}'s image`} 
           /> 
           {showName && ( 
             <span className="absolute bottom-0 hidden h-full w-full flex-col justify-center rounded-3xl bg-slate-50/0 p-1 py-0 text-center text-sm font-semibold text-rayanPrimary-dark duration-500 hover:bg-slate-50/85 sm:flex sm:text-lg"> 
               {section.name} 
             </span> 
           )} 
           <span className="absolute bottom-0 flex h-1/3 w-full flex-col justify-center rounded-md rounded-bl-3xl rounded-br-3xl bg-slate-200/85 p-1 py-0 text-center text-xs font-semibold text-rayanPrimary-dark sm:hidden"> 
             {section.name} 
           </span> 
         </CardContent> 
       </LoadingLink> 
     </Card> 
   );
}

export function SectionCardSkeleton() {
  return (
    <div className="h-24 animate-pulse rounded-3xl bg-gray-400 object-cover sm:h-44"></div>
  );
}
