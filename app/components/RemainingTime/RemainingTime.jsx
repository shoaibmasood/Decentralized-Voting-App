"use client";
import React, { useEffect, useState } from "react";

function RemainingTime({ votingEndTime }) {
  const [timeLeft, setTimeLeft] = useState(null);

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const futureTime = votingEndTime.toString() * 1000;
    const difference = futureTime - now;
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  useEffect(() => {
    if (votingEndTime > 0) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [votingEndTime]);

  console.log("votingEndTime from Component", votingEndTime);
  console.log("TimeLeft", timeLeft);
  return (
    <div className="font-extrabold">
      <span>{timeLeft?.minutes} Minutes : </span>
      <span>{timeLeft?.seconds} Seconds </span>
      Remaining
    </div>
  );
}

export default RemainingTime;
