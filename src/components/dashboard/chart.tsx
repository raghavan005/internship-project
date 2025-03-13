import React, { useEffect, useRef, memo } from "react";

function TradingViewWidget() {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container.current) return; 

    
    container.current.innerHTML = "";

    
    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    container.current.appendChild(widgetDiv);

    
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "width": "1600",
          "height": "730",
          "symbol": "NASDAQ:AAPL",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "withdateranges": true,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "watchlist": [
            "NASDAQ:MSFT",
            "NASDAQ:META",
            "NASDAQ:GOOGL",
            "NASDAQ:AAPL",
            "NASDAQ:NVDA"
          ],
          "details": true,
          "hotlist": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;

    container.current.appendChild(script);

    
    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ width: "980px", height: "610px", margin: "auto" }} // Fixed size
    >
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
