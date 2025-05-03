'use client';

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface ZoomProps {
  svgRef: React.RefObject<SVGSVGElement>;
  width: number;
  height: number;
  onZoom?: (transform: d3.ZoomTransform) => void;
}

export default function Zoom({ svgRef, width, height, onZoom }: ZoomProps) {
  const zoomBehavior = useRef<d3.ZoomBehavior<Element, unknown>>();

  useEffect(() => {
    if (!svgRef.current) return;

    // Initialize zoom behavior
    zoomBehavior.current = d3
      .zoom()
      .scaleExtent([0.2, 4]) // Zoom scale limits: 20% to 400%
      .translateExtent([[-width, -height], [width * 2, height * 2]]) // Pan limits
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        const svg = d3.select(svgRef.current);
        const transform = event.transform;
        
        // Apply transform to the main content group
        svg.select('g.zoom-content').attr('transform', transform.toString());
        
        // Call the onZoom callback if provided
        if (onZoom) {
          onZoom(transform);
        }
      });

    // Apply zoom behavior to SVG element
    d3.select(svgRef.current).call(zoomBehavior.current);

    // Initial zoom level - fit view
    const initialTransform = d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8);
    d3.select(svgRef.current)
      .call(zoomBehavior.current.transform, initialTransform);

    return () => {
      // Clean up if necessary
      if (svgRef.current) {
        d3.select(svgRef.current).on('.zoom', null);
      }
    };
  }, [svgRef, width, height, onZoom]);

  return (
    <div className="absolute bottom-4 right-4 flex bg-white rounded-md shadow-md">
      <button
        className="px-3 py-2 border-r border-gray-200 hover:bg-gray-100"
        onClick={() => {
          if (svgRef.current && zoomBehavior.current) {
            d3.select(svgRef.current)
              .transition()
              .duration(300)
              .call(zoomBehavior.current.scaleBy, 1.2);
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
      <button
        className="px-3 py-2 border-r border-gray-200 hover:bg-gray-100"
        onClick={() => {
          if (svgRef.current && zoomBehavior.current) {
            d3.select(svgRef.current)
              .transition()
              .duration(300)
              .call(zoomBehavior.current.scaleBy, 0.8);
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
        </svg>
      </button>
      <button
        className="px-3 py-2 hover:bg-gray-100"
        onClick={() => {
          if (svgRef.current && zoomBehavior.current) {
            const initialTransform = d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8);
            d3.select(svgRef.current)
              .transition()
              .duration(500)
              .call(zoomBehavior.current.transform, initialTransform);
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
        </svg>
      </button>
    </div>
  );
}