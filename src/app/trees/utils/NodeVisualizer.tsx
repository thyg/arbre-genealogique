import * as d3 from 'd3';

/**
 * Configure le comportement de zoom et de déplacement
 */
export const setupZoom = (svg, margin) => {
  // Set up zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([0.2, 3])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });
  
  svg.call(zoom);
  
  // Create the main group element
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
    
  return g;
};

/**
 * Dessine les liens entre les noeuds
 */
export const drawLinks = (g, { positions }, peopleDatabase) => {
  // Create links array
  const links = [];
  
  Object.values(positions).forEach(position => {
    if (position.parentId && positions[position.parentId]) {
      links.push({
        source: positions[position.parentId],
        target: position
      });
    }
  });
  
  // Draw the links
  g.selectAll('.link')
    .data(links)
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', d => {
      if (d.source.node.isFamilyNode || d.target.node.isFamilyNode) {
        // Simple straight line for family connections
        return `M ${d.source.x} ${d.source.y} L ${d.target.x} ${d.target.y}`;
      } else {
        // For regular links, use curved paths
        return `M ${d.source.x} ${d.source.y} 
                C ${d.source.x} ${(d.source.y + d.target.y) / 2},
                  ${d.target.x} ${(d.source.y + d.target.y) / 2},
                  ${d.target.x} ${d.target.y}`;
      }
    })
    .attr('stroke', d => {
      // Family nodes get a dashed line
      if (d.source.node.isFamilyNode || d.target.node.isFamilyNode) {
        return '#888';
      }
      
      // Partner connections
      const sourceNode = d.source.node;
      const targetNode = d.target.node;
      
      if (sourceNode.partners && sourceNode.partners.includes(targetNode.id)) {
        return '#9333ea'; // Purple for partner
      }
      
      // Child connections
      if (sourceNode.children && sourceNode.children.includes(targetNode.id)) {
        return '#4f46e5'; // Indigo for child
      }
      
      // Parent connections
      if (targetNode.parents && targetNode.parents.includes(sourceNode.id)) {
        return '#059669'; // Green for parent
      }
      
      return '#888'; // Default gray
    })
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('stroke-dasharray', d => {
      return (d.source.node.isFamilyNode || d.target.node.isFamilyNode) ? '5,5' : 'none';
    });
};

/**
 * Dessine les noeuds de l'arbre
 */
export const drawNodes = (g, { positions }, peopleDatabase, selectedNode, onNodeClick) => {
  // Create node groups for people (not family nodes)
  const nodeGroups = g.selectAll('.node')
    .data(Object.values(positions).filter(p => !p.node.isFamilyNode))
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x},${d.y})`)
    .on('click', (event, d) => {
      event.stopPropagation();
      if (onNodeClick) onNodeClick(d.node.id);
    });
  
  // Draw node background rectangle
  nodeGroups.append('rect')
    .attr('x', -60)
    .attr('y', -30)
    .attr('width', 120)
    .attr('height', 60)
    .attr('rx', 10)
    .attr('ry', 10)
    .attr('fill', d => {
      if (d.node.type === 'self') {
        return d.node.gender === 'male' ? '#bfdbfe' : '#fbcfe8';
      }
      return d.node.gender === 'male' ? '#dbeafe' : '#fce7f3';
    })
    .attr('stroke', d => {
      if (selectedNode && selectedNode.id === d.node.id) {
        return '#000';
      }
      return d.node.gender === 'male' ? '#3b82f6' : '#ec4899';
    })
    .attr('stroke-width', d => selectedNode && selectedNode.id === d.node.id ? 3 : 1)
    .attr('opacity', 0.9);
  
  // Draw profile image circle or icon
  nodeGroups.append('circle')
    .attr('cy', -10)
    .attr('r', 15)
    .attr('fill', d => {
      if (d.node.profileImage) {
        return `url(#pattern-${d.node.id})`;
      }
      return d.node.gender === 'male' ? '#93c5fd' : '#f9a8d4';
    })
    .attr('stroke', '#fff')
    .attr('stroke-width', 2);
  
  // Add pattern definitions for profile images
  nodeGroups.filter(d => d.node.profileImage)
    .append('defs')
    .