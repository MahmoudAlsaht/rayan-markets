import { MdOutlineSignalWifiStatusbarConnectedNoInternet4 } from "react-icons/md";

export default function OfflinePage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-100"
      dir="ltr"
    >
      <div className="text-center">
        <h1 className="mb-4 flex items-center justify-center gap-5 text-4xl font-bold">
          <MdOutlineSignalWifiStatusbarConnectedNoInternet4 />
          أنت غير متصل بالشبكة{" "}
        </h1>
        <p className="text-lg text-gray-600">
          .يرجى التحقق من اتصالك بالإنترنت و المحاولة مرة أخرى
        </p>
      </div>
    </div>
  );
}
