"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class CanvasErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("[3D Canvas] Handled rendering failure gracefully:", error.message);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center rounded-2xl bg-zinc-900/40 border border-white/5 p-6 text-center text-xs text-zinc-400">
            <span>3D card preview mode</span>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

