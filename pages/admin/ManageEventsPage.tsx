
import React, { useState } from 'react';
import { useContent } from '../../hooks/useContent';
import type { Event } from '../../types';
import MultiImageUpload from '../../components/MultiImageUpload';

const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500";
const labelClasses = "block text-sm font-medium text-zinc-700 dark:text-zinc-200";

const ManageEventsPage = () => {
    const { content, updateEvents } = useContent();
    const [events, setEvents] = useState<Event[]>(content.events);
    const [status, setStatus] = useState('');

    const handleEventChange = (index: number, field: keyof Event, value: string | string[]) => {
        const newEvents = [...events];
        const eventToUpdate = { ...newEvents[index], [field]: value };
        newEvents[index] = eventToUpdate;
        setEvents(newEvents);
    };

    const handleAddEvent = () => {
        const newEvent: Event = { id: Date.now().toString(), title: '', date: '', description: '', images: [] };
        setEvents(prev => [...prev, newEvent]);
    };
    
    const handleDeleteEvent = (id: string) => {
        setEvents(prev => prev.filter(event => event.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateEvents(events);
            setStatus('Events updated successfully!');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus('Failed to update. Please try again.');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Manage Events</h1>
            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
                
                <fieldset className="space-y-4 border p-4 rounded-md">
                    <legend className="text-xl font-semibold px-2">Events List</legend>
                    {events.length === 0 && <p className="text-zinc-500 dark:text-zinc-400">No events created yet. Click "Add Event" to start.</p>}
                    {events.map((event, index) => (
                        <div key={event.id} className="p-3 border-t relative space-y-3">
                            <button type="button" onClick={() => handleDeleteEvent(event.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1" aria-label={`Delete event: ${event.title}`}>&times;</button>
                            <div>
                                <label htmlFor={`event-title-${index}`} className={labelClasses}>Event Title</label>
                                <input type="text" id={`event-title-${index}`} value={event.title} onChange={(e) => handleEventChange(index, 'title', e.target.value)} className={inputClasses} />
                            </div>
                            <div>
                                <label htmlFor={`event-date-${index}`} className={labelClasses}>Date</label>
                                <input type="date" id={`event-date-${index}`} value={event.date} onChange={(e) => handleEventChange(index, 'date', e.target.value)} className={inputClasses} />
                            </div>
                            <div>
                                <label htmlFor={`event-desc-${index}`} className={labelClasses}>Description</label>
                                <textarea id={`event-desc-${index}`} rows={3} value={event.description} onChange={(e) => handleEventChange(index, 'description', e.target.value)} className={inputClasses}></textarea>
                            </div>
                             <MultiImageUpload 
                                label="Event Images" 
                                currentImageUrls={event.images} 
                                onImagesChange={(urls) => handleEventChange(index, 'images', urls)}
                                aspect={16/9}
                            />
                        </div>
                    ))}
                     <button type="button" onClick={handleAddEvent} className="px-4 py-2 border border-dashed border-zinc-400 rounded-md">Add Event</button>
                </fieldset>
                
                <div>
                    <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save Changes</button>
                    {status && <span className="ml-4 text-green-600">{status}</span>}
                </div>
            </form>
        </div>
    );
};

export default ManageEventsPage;
