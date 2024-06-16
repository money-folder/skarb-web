"use client";

import React, { useEffect, useRef } from "react";

import { ClientWhistoryDto } from "@/types/wallets-history";

import {
  createHorizontalAxisPoints,
  createVerticalAxisPoints,
  createWhistoryPoints,
} from "./utils";
import { drawLine, drawLinesFromPoints } from "./services";

interface Props {
  width: number;
  height: number;
  list: ClientWhistoryDto[];
}

const WalletHistoryChart = ({ width, height, list }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvasRef.current.getContext("2d");
    if (!context) {
      return;
    }

    const canvasSize = {
      height: canvas.height,
      width: canvas.width,
    };

    context.clearRect(0, 0, canvas.width, canvas.height);

    const points = createWhistoryPoints(list, canvasSize);

    points.forEach((point) => {
      context.beginPath();

      // draw a point
      context.arc(point.x, point.y, 2, 0, Math.PI * 2);
      context.fill();

      context.closePath();
    });

    drawLinesFromPoints(context, points);

    // draw a frame
    context.strokeRect(0, 0, canvas.width, canvas.height);

    // draw horizontal axis
    drawLine(context, 0, canvas.height, canvas.width, canvas.height, {
      lineWidth: 5,
    });

    const hAxisPoints = createHorizontalAxisPoints(list, canvasSize);

    hAxisPoints.forEach((point) => {
      context.lineWidth = 1;
      context.font = "12px serif";
      context.strokeText(point.label, point.x - 20, point.y - 15);

      drawLine(context, point.x, point.y, point.x, point.y - 10, {
        lineWidth: 2,
      });
    });

    // draw vertical axis
    drawLine(context, 0, 0, 0, canvas.height, {
      lineWidth: 5,
    });

    const vAxisPoints = createVerticalAxisPoints(list, canvasSize);
    vAxisPoints.forEach((point) => {
      context.lineWidth = 1;
      context.font = "12px serif";
      context.strokeText(point.label, point.x + 15, point.y + 3);

      drawLine(context, point.x, point.y, point.x + 10, point.y, {
        lineWidth: 2,
      });
    });
  }, [list]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default WalletHistoryChart;
