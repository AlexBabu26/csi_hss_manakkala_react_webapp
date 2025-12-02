import React, { useState, useRef, DragEvent } from 'react';
import Icon from './Icon';

interface DraggableItem {
  id: string;
  [key: string]: any;
}

interface DraggableListProps<T extends DraggableItem> {
  items: T[];
  onReorder: (reorderedItems: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  dragHandleLabel?: string;
}

function DraggableList<T extends DraggableItem>({
  items,
  onReorder,
  renderItem,
  dragHandleLabel = 'Drag to reorder'
}: DraggableListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const draggedItem = useRef<T | null>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    draggedItem.current = items[index];
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
    
    // Add slight opacity to dragged element
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedItem.current === null || draggedIndex === null) return;

    const newItems = [...items];
    
    // Remove dragged item
    newItems.splice(draggedIndex, 1);
    
    // Insert at new position
    newItems.splice(dropIndex, 0, draggedItem.current);
    
    onReorder(newItems);
    draggedItem.current = null;
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          className={`
            relative bg-white dark:bg-zinc-800 border-2 rounded-lg p-4 cursor-move transition-all
            ${draggedIndex === index ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
            ${dragOverIndex === index && draggedIndex !== index ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 border-dashed' : 'border-zinc-300 dark:border-zinc-600'}
            hover:border-primary-400 hover:shadow-lg
          `}
        >
          {/* Drag Handle */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary-600 cursor-grab active:cursor-grabbing">
            <div className="flex flex-col gap-1" title={dragHandleLabel}>
              <Icon className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              </Icon>
            </div>
          </div>

          {/* Item Content */}
          <div className="ml-8">
            {renderItem(item, index)}
          </div>

          {/* Order Badge */}
          <div className="absolute top-2 right-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DraggableList;

