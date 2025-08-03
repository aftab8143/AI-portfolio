// components/SwiperGallery.jsx
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function SwiperGallery({ images }) {
  return (
    <div className="w-full mx-auto bg-slate-800 rounded-xl overflow-hidden p-4">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 6500, disableOnInteraction: true }}
        loop
        pagination={{ clickable: true }}
        className="rounded-lg"
      >
        {images.map((src, i) => {
          const isMobileImage = /kk|deligo|logik|oflep/i.test(src);

          return (
            <SwiperSlide
              key={i}
              className="flex justify-center items-center bg-slate-800"
            >
              <div
                className={`relative w-full ${
                  isMobileImage
                    ? "h-[400px] sm:h-[400px]" // Mobile image
                    : "h-[400px] sm:h-[450px]" // Web image
                } rounded-md overflow-hidden`}
              >
                <Image
                  src={src}
                  alt={`Slide ${i + 1}`}
                  fill
                  sizes="100%"
                  className="object-contain"
                  style={{ backgroundColor: "#1e293b", objectFit: "contain" }}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
