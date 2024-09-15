"use client";

import React, { useLayoutEffect, useState } from "react";
import { DownloadIcon, X, Info } from "lucide-react";

const InstallPWA: React.FC = () => {
  const [promptInstall, setPromptInstall] = useState<Event | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [startDateState, setStartDateState] = useState<number | null>(null);
  const [platform, setPlatform] = useState<
    "android" | "ios" | "windows" | "macos" | "firefox" | "other"
  >("other");

  useLayoutEffect(() => {
    const checkInstallation = () => {
      if (typeof window !== "undefined") {
        if (
          window.matchMedia("(display-mode: standalone)").matches ||
          document.referrer.startsWith("android-app://") ||
          (navigator as any).standalone
        ) {
          localStorage.setItem("pwaInstalled", "1");
          return true;
        }
        localStorage.setItem("pwaInstalled", "0");
        return false;
      }
      return false;
    };

    const detectPlatform = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (/android/.test(userAgent)) return "android";
      if (/iphone|ipad|ipod/.test(userAgent)) return "ios";
      if (/win/.test(userAgent)) return "windows";
      if (/mac/.test(userAgent)) return "macos";
      if (/firefox/.test(userAgent)) return "firefox";
      return "other";
    };

    const checkExpirationAndSetButton = () => {
      if (typeof window !== "undefined") {
        const startDate = localStorage.getItem("startDate");
setStartDateState(startDate ? JSON.parse(startDate) : null)
      }
    };

    const installHandler = (e: Event) => {
      e.preventDefault();
      setPromptInstall(e);
    };

    const afterInstalledHandler = () => {
      localStorage.setItem("pwaInstalled", "1");
      setIsInstalled(true);
    };

    setIsInstalled(checkInstallation());
    setPlatform(detectPlatform());
    checkExpirationAndSetButton();

    if (typeof window !== "undefined") {
      window.addEventListener("beforeinstallprompt", installHandler);
      window.addEventListener("appinstalled", afterInstalledHandler);

      return () => {
        window.removeEventListener("beforeinstallprompt", installHandler);
        window.removeEventListener("appinstalled", afterInstalledHandler);
      };
    }
  }, []);

    if (typeof window === "undefined") return null; 

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      const date = new Date().getTime() + 4 * 24 * 60 * 60 * 1000; // 4 days in milliseconds
      localStorage.setItem("startDate", JSON.stringify(date));
      setStartDateState(date);
    }
  };

  const handleInstall = () => {
    if (promptInstall) {
      (promptInstall as any).prompt();
    } else if (platform === "firefox") {
      // Firefox-specific installation
      const manifestUrl = "./public/manifest.json";
      const manifestElement = document.createElement("link");
      manifestElement.rel = "manifest";
      manifestElement.href = manifestUrl;
      document.head.appendChild(manifestElement);

      alert('للتثبيت على Firefox: انقر فوق زر "تثبيت" في شريط العناوين.');
    }
  };

  if (startDateState != null && new Date().getTime() - startDateState < 4 * 24 * 60 * 60 * 1000) return null;

 if (isInstalled) return null;
  

  const renderInstallInstructions = () => {
    switch (platform) {
      case "ios":
        return (
          <div className="text-sm">
            <p>للتثبيت:</p>
            <ol className="list-inside list-decimal">
              <li>اضغط على زر المشاركة</li>
              <li>
                قم بالتمرير لأسفل وانقر على &quot;إضافة إلى الشاشة
                الرئيسية&quot;
              </li>
            </ol>
          </div>
        );
      case "macos":
        return (
          <div className="text-sm">
            <p>للتثبيت:</p>
            <ol className="list-inside list-decimal">
              <li>انقر على زر المشاركة في شريط العناوين</li>
              <li>اختر &quot;أضف إلى Dock&quot;</li>
            </ol>
          </div>
        );
      case "firefox":
        return (
          <div className="text-sm">
            <p>للتثبيت على Firefox:</p>
            <ol className="list-inside list-decimal">
              <li>ثم انقر على &quot;ثَبَّتَ&quot; الزر في شريط العنوان</li>
            </ol>
          </div>
        );
      default:
        return (
          <button
            className="flex my-auto bg-inherit/60 w-full items-center justify-center gap-2 rounded-lg p-2 text-rayanPrimary-light hover:bg-rayanSecondary-light"
            onClick={handleInstall}
          >
            <DownloadIcon className="mr-2" />
            <span>تثبيت</span>
          </button>
        );
    }
  };

  return (
    <div
      dir="rtl"
      id="toast-default"
      className="fixed top-1/2 h-40 sm:bottom-3 z-50 mr-1 flex w-[97%] flex-col rounded-lg bg-rayanSecondary-dark p-4 shadow sm:right-14 sm:mr-0 sm:w-full sm:max-w-xs"
      role="alert"
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="mr-2" />
          <span className="font-semibold">Install Our App</span>
        </div>
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg p-1.5 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          aria-label="Close"
          onClick={handleDismiss}
        >
          <X />
        </button>
      </div>
      {renderInstallInstructions()}
    </div>
  );
};

export default InstallPWA;