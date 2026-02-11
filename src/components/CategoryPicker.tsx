import { QUESTION_TYPE_LABELS } from '../data/prompts';
import { Card } from './ui/Card';

interface CategoryPickerProps {
  onSelect: (type?: string) => void;
}

export function CategoryPicker({ onSelect }: CategoryPickerProps) {
  const types = Object.entries(QUESTION_TYPE_LABELS);

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold text-stone-800">Choose your drill</h2>
        <p className="text-stone-500 text-sm mt-1">Pick a question type or go random</p>
      </div>

      <button
        onClick={() => onSelect()}
        className="w-full text-left"
      >
        <Card className="hover:border-stone-300 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎲</span>
            <div>
              <p className="font-medium text-stone-800">Random</p>
              <p className="text-sm text-stone-500">Surprise me with any question type</p>
            </div>
          </div>
        </Card>
      </button>

      <div className="grid gap-2">
        {types.map(([key, val]) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="w-full text-left"
          >
            <Card className="hover:border-stone-300 transition-colors cursor-pointer py-4">
              <p className="font-medium text-stone-800">{val.label}</p>
              <p className="text-sm text-stone-500">{val.description}</p>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
