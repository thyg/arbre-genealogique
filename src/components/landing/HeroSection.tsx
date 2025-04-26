  // src/components/landing/HeroSection.tsx
  'use client';
  import { useEffect, useRef } from 'react';
  import * as d3 from 'd3';
  import Link from 'next/link';

  export default function HeroSection() {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
      if (!svgRef.current) return;

      const svg = d3.select(svgRef.current);
      const width = svgRef.current.clientWidth;
      const height = 400;

      // Clear previous render
      svg.selectAll('*').remove();

      // Set SVG dimensions
      svg.attr('viewBox', `0 0 ${width} ${height}`);

      // Sample family tree data
      const treeData = {
        name: "Vous",
        children: [
          {
            name: "Parent 1",
            children: [
              { name: "Grand-Parent 1" },
              { name: "Grand-Parent 2" }
            ]
          },
          {
            name: "Parent 2",
            children: [
              { name: "Grand-Parent 3" },
              { name: "Grand-Parent 4" }
            ]
          }
        ]
      };

      // Create tree layout
      const root = d3.hierarchy(treeData);
      const treeLayout = d3.tree().size([width * 0.8, height * 0.6]);
      treeLayout(root);

      // Draw links
      svg.append('g')
        .selectAll('path')
        .data(root.links())
        .enter()
        .append('path')
        .attr('d', d3.linkVertical()
          .x(d => d.x + width * 0.1)
          .y(d => d.y + height * 0.2)
        )
        .attr('fill', 'none')
        .attr('stroke', '#3B82F6')
        .attr('stroke-width', 2);

      // Draw nodes
      const nodes = svg.append('g')
        .selectAll('g')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x + width * 0.1},${d.y + height * 0.2})`);

      nodes.append('circle')
        .attr('r', 20)
        .attr('fill', '#2563EB')
        .attr('stroke', '#1D4ED8')
        .attr('stroke-width', 2);

      nodes.append('text')
        .attr('dy', 4)
        .attr('text-anchor', 'middle')
        .text(d => d.data.name)
        .attr('fill', 'white')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold');

      // Animation
      svg.selectAll('path, circle')
        .attr('opacity', 0)
        .transition()
        .duration(800)
        .attr('opacity', 1);

    }, []);

    return (
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-700 text-white pt-24 pb-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Visualisez votre <span className="text-blue-300">histoire familiale</span> comme jamais auparavant
              </h1>
              <p className="text-xl mb-8 text-blue-100 max-w-lg">
                Créez, explorez et partagez votre arbre généalogique avec notre technologie interactive avancée.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/arbre"
                  className="bg-white text-blue-800 px-8 py-4 rounded-lg font-semibold text-center hover:bg-gray-100 transition flex items-center justify-center"
                >
                  Commencer gratuitement
                </Link>
                <Link
                  href="#features"
                  className="border-2 border-white px-8 py-4 rounded-lg font-semibold text-center hover:bg-white hover:bg-opacity-10 transition flex items-center justify-center"
                >
                  Découvrir les fonctionnalités
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                <svg
                  ref={svgRef}
                  width="100%"
                  height="400"
                  className="transition-all duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-white text-blue-800 rounded-full p-3 shadow-lg hover:scale-110 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>
    );
  }