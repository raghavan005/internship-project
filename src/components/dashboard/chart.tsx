import React, { useEffect, useRef, memo } from "react";

function TradingViewWidget() {
  // ✅ Fix: Provide an initial value (null) to useRef
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container.current) return; // ✅ Prevents null reference issues

    // Clear any previous widget to prevent duplication
    container.current.innerHTML = "";

    // Create a new div for the widget
    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    container.current.appendChild(widgetDiv);

    // Create the script element
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "NASDAQ:GOOGL",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "0",
        "locale": "en",
        "withdateranges": true,
        "range": "1D",
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "watchlist": [
          "NASDAQ:GOOGL",
          "NASDAQ:MSFT",
          "NASDAQ:AAPL"
        ],
        "details": true,
        "hotlist": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      }`;

    container.current.appendChild(script);
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "90%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      ></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
