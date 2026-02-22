import { MonitorPlay } from 'lucide-react';
import Image from 'next/image';

interface Application {
    id: string;
    name: string;
    code: string;
    imageUrl?: string;
}

export default function ApplicationCard({ app }: { app: Application }) {
    return (
        <div className="flex flex-col items-center justify-start p-3 group cursor-pointer">
            {/* Circular Logo Interface mimicking the screenshot */}
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-card border-[3.5px] border-[#0ea5e9]/70 group-hover:border-primary transition-all duration-500 shadow-md group-hover:shadow-primary/30 group-hover:shadow-2xl flex flex-col items-center justify-center overflow-hidden mb-3">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/20" />

                {app.imageUrl ? (
                    <Image src={app.imageUrl} alt={app.name} fill className="object-cover z-10 group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <>
                        <MonitorPlay className="w-8 h-8 md:w-10 md:h-10 text-primary/80 group-hover:scale-110 transition-transform duration-500 mb-1 md:mb-2 z-10" />
                        <span className="text-[9px] md:text-[11px] font-black text-center px-4 z-10 tracking-widest leading-tight uppercase line-clamp-2">
                            {app.name}
                        </span>
                    </>
                )}

                {/* Subdued reflection effect */}
                <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/10 to-transparent rotate-45 pointer-events-none group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </div>

            {/* Caption Area */}
            <div className="text-center mt-1">
                <h3 className="text-[10px] md:text-xs font-black group-hover:text-primary transition-colors uppercase tracking-wider mb-0.5 leading-tight">
                    {app.name}
                </h3>
                <span className="text-[11px] md:text-sm font-mono font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    ({app.code})
                </span>
            </div>
        </div>
    );
}
