import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Building } from 'lucide-react';

interface OrgNode {
  id: string;
  role: string;
  department?: string;
  children?: OrgNode[];
}

const CARD_W = 160;
const CARD_H = 54;
const H_GAP = 40;   // horizontal gap between sibling cards
const V_GAP = 100;  // vertical gap between levels

const mockOrgData: OrgNode = {
  id: '1',
  role: 'Director',
  department: 'Executive',
  children: [
    {
      id: '2',
      role: 'Financial Officers',
      department: 'Finance',
      children: [
        {
          id: '5',
          role: 'Area Managers',
          department: 'Finance',
          children: [
            { id: '8', role: 'Team Leaders', department: 'Finance' }
          ]
        }
      ]
    },
    {
      id: '3',
      role: 'Operations Officers',
      department: 'Operations',
      children: [
        {
          id: '6',
          role: 'Area Managers',
          department: 'Operations',
          children: [
            { id: '9', role: 'Team Leaders', department: 'Operations' }
          ]
        }
      ]
    },
    {
      id: '4',
      role: 'HR',
      department: 'Human Resources',
      children: [
        {
          id: '7',
          role: 'Area Managers',
          department: 'Human Resources',
          children: [
            { id: '10', role: 'Team Leaders', department: 'Human Resources' }
          ]
        }
      ]
    },
    {
      id: '11',
      role: 'Credit Analyst',
      department: 'Credit & Risk',
      children: [
        {
          id: '12',
          role: 'Area Managers',
          department: 'Credit & Risk',
          children: [
            { id: '13', role: 'Team Leaders', department: 'Credit & Risk' }
          ]
        }
      ]
    }
  ]
};

function getDotColor(dept?: string): string {
  if (!dept) return '#C8A84B';
  const d = dept.toLowerCase();
  if (d.includes('executive')) return '#8B5A2B';
  if (d.includes('operations')) return '#6B8E23';
  if (d.includes('finance')) return '#CD853F';
  if (d.includes('human resources') || d.includes('hr')) return '#7B68EE';
  if (d.includes('credit') || d.includes('risk')) return '#BC8F8F';
  return '#C8A84B';
}

// Layout computation
interface LayoutNode {
  node: OrgNode;
  x: number;  // center-x
  y: number;  // top-y of card
  children: LayoutNode[];
}

function computeSubtreeWidth(node: OrgNode): number {
  if (!node.children || node.children.length === 0) return CARD_W;
  const childrenWidth = node.children.reduce(
    (sum, child, i) => sum + computeSubtreeWidth(child) + (i > 0 ? H_GAP : 0),
    0
  );
  return Math.max(CARD_W, childrenWidth);
}

function buildLayout(node: OrgNode, x: number, y: number): LayoutNode {
  const layoutNode: LayoutNode = { node, x, y, children: [] };
  if (!node.children || node.children.length === 0) return layoutNode;

  const totalWidth = node.children.reduce(
    (sum, child, i) => sum + computeSubtreeWidth(child) + (i > 0 ? H_GAP : 0),
    0
  );
  let curX = x - totalWidth / 2;
  for (const child of node.children) {
    const w = computeSubtreeWidth(child);
    layoutNode.children.push(buildLayout(child, curX + w / 2, y + CARD_H + V_GAP));
    curX += w + H_GAP;
  }
  return layoutNode;
}

function collectNodes(layout: LayoutNode): LayoutNode[] {
  const result: LayoutNode[] = [layout];
  for (const child of layout.children) result.push(...collectNodes(child));
  return result;
}

function collectEdges(layout: LayoutNode): Array<{ px: number; py: number; cx: number; cy: number }> {
  const edges: Array<{ px: number; py: number; cx: number; cy: number }> = [];
  for (const child of layout.children) {
    edges.push({
      px: layout.x,
      py: layout.y + CARD_H,
      cx: child.x,
      cy: child.y,
    });
    edges.push(...collectEdges(child));
  }
  return edges;
}

export default function OrgChart() {
  const rootY = 40;
  const layout = buildLayout(mockOrgData, 0, rootY);
  const allNodes = collectNodes(layout);
  const allEdges = collectEdges(layout);

  const minX = Math.min(...allNodes.map(n => n.x - CARD_W / 2));
  const maxX = Math.max(...allNodes.map(n => n.x + CARD_W / 2));
  const minY = 0;
  const maxY = Math.max(...allNodes.map(n => n.y + CARD_H)) + 40;

  const svgW = maxX - minX + 60;
  const svgH = maxY - minY + 20;
  const offsetX = -minX + 30;
  const offsetY = 10;

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative">

      {/* SVG Org Chart */}
      <div className="glass-card rounded-2xl border border-[var(--p-line)] overflow-x-auto flex justify-center">
        <svg
          width={svgW}
          height={svgH}
          style={{ display: 'block' }}
        >
          {/* Edges with cubic bezier curves */}
          {allEdges.map((e, i) => {
            const x1 = e.px + offsetX;
            const y1 = e.py + offsetY;
            const x2 = e.cx + offsetX;
            const y2 = e.cy + offsetY;
            const midY = (y1 + y2) / 2;
            return (
              <path
                key={i}
                d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                fill="none"
                stroke="#C8A84B"
                strokeWidth="1.5"
                strokeOpacity="0.7"
              />
            );
          })}

          {/* Nodes */}
          {allNodes.map((n) => {
            const cx = n.x + offsetX;
            const cy = n.y + offsetY;
            const dot = getDotColor(n.node.department);
            return (
              <g key={n.node.id}>
                {/* Card background */}
                <rect
                  x={cx - CARD_W / 2}
                  y={cy}
                  width={CARD_W}
                  height={CARD_H}
                  rx={10}
                  ry={10}
                  fill="#1A1F1C"
                  stroke="#C8A84B"
                  strokeOpacity="0.3"
                  strokeWidth="1"
                />
                {/* Colored dot */}
                <circle
                  cx={cx - CARD_W / 2 + 18}
                  cy={cy + CARD_H / 2}
                  r={6}
                  fill={dot}
                />
                {/* Role text */}
                <text
                  x={cx - CARD_W / 2 + 32}
                  y={cy + CARD_H / 2 - 4}
                  fill="rgba(255,255,255,0.9)"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="Outfit, sans-serif"
                  dominantBaseline="middle"
                >
                  {n.node.role.length > 16 ? n.node.role.slice(0, 15) + '…' : n.node.role}
                </text>
                {/* Department text */}
                {n.node.department && (
                  <text
                    x={cx - CARD_W / 2 + 32}
                    y={cy + CARD_H / 2 + 11}
                    fill="rgba(255,255,255,0.3)"
                    fontSize="8.5"
                    fontFamily="Outfit, sans-serif"
                    dominantBaseline="middle"
                  >
                    {n.node.department.length > 18 ? n.node.department.slice(0, 17) + '…' : n.node.department}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
