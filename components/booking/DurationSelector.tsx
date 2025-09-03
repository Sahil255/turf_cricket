import { useCallback } from 'react';
// import './DurationSelector.css';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';

interface DurationSelectorProps {
  selectedDuration: number; // In minutes (e.g., 60 for 60min)
   setSelectedDuration: React.Dispatch<React.SetStateAction<number>>; // Correct type for setStated;
}

const DurationSelector: React.FC<DurationSelectorProps> = ({
  selectedDuration,
  setSelectedDuration,
}) => {
  // Format duration (e.g., "1hr 30min")
  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}hr${remainingMinutes ? ` ${remainingMinutes}min` : ''}`;
    }
    return `${minutes}min`;
  };

  // Handle decrement
  const handleDecrement = useCallback(() => {
    setSelectedDuration((prev) => Math.max(30, prev - 30));
  }, [setSelectedDuration]);

  // Handle increment
  const handleIncrement = useCallback(() => {
    setSelectedDuration((prev) => Math.min(240, prev + 30));
  }, [setSelectedDuration]);

  return (
    <div className="grid grid-cols-[60px_1fr_60px] items-center  max-w-md mx-auto bg-black border-2 border-white rounded-lg p-2 shiny-gold-block">
      {/* Minus Button */}
      <button
        onClick={handleDecrement}
        disabled={selectedDuration <= 30}
        className="p-1 items-center text-white hover:scale-105 flex justify-start  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shiny-gold-button"
        aria-label="Decrease duration by 30 minutes"
      >
        <Minus className="text-sm" />
      </button>

      {/* Duration Display */}
      <div className="text-center items-center  text-white text-sm font-extrabold  animate-fade-in">
        {formatDuration(selectedDuration)}
      </div>

      {/* Plus Button */}
      <button
        onClick={handleIncrement}
        disabled={selectedDuration >= 240}
        className="p-1 text-white   hover:scale-105 flex justify-end  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shiny-gold-button"
        aria-label="Increase duration by 30 minutes"
      >
        <Plus className="text-sm" />
      </button>
    </div>
  );
};

export default DurationSelector;