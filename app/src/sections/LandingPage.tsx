import { useRef } from 'react';
import { FilePlus, FolderPlus, FileJson } from 'lucide-react';

interface LandingPageProps {
  onCreateNew: () => void;
  onExistingCV: () => void;
  onImport: (file: File) => Promise<void>;
}

export function LandingPage({ onCreateNew, onExistingCV, onImport }: LandingPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onImport(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
        Comment voulez-vous
      </h1>
      <h1 className="text-4xl font-bold text-[#2196F3] mb-12 text-center">
        créer votre CV ?
      </h1>

      <div className="flex flex-wrap justify-center gap-6 mb-8">
        <button
          onClick={onCreateNew}
          className="flex flex-col items-center p-8 bg-white rounded-lg border-2 border-[#2196F3] hover:shadow-lg transition-shadow w-80"
        >
          <div className="w-16 h-16 bg-[#2196F3] rounded-lg flex items-center justify-center mb-4">
            <FilePlus className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Créez un nouveau CV</h3>
          <p className="text-gray-500 text-center text-sm">
            Nous allons vous aider à créer votre CV étape par étape
          </p>
        </button>

        <button
          onClick={onExistingCV}
          className="flex flex-col items-center p-8 bg-white rounded-lg border border-gray-200 hover:border-[#2196F3] hover:shadow-lg transition-all w-80"
        >
          <div className="w-16 h-16 bg-[#4CAF50] rounded-lg flex items-center justify-center mb-4">
            <FolderPlus className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Je possède déjà un CV</h3>
          <p className="text-gray-500 text-center text-sm">
            Nous allons faire la mise en page de votre CV et saisir vos informations à votre place.
          </p>
        </button>

        <button
          onClick={handleImportClick}
          className="flex flex-col items-center p-8 bg-white rounded-lg border border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all w-80"
        >
          <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
            <FileJson className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Importer un CV</h3>
          <p className="text-gray-500 text-center text-sm">
            Importez vos données depuis un fichier JSON précédemment exporté.
          </p>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-gray-500 text-center text-sm max-w-2xl">
        En continuant, vous commencez à construire votre CV IA, acceptez de créer un compte et acceptez nos{' '}
        <a href="#" className="text-[#2196F3] underline">Conditions Générales</a> et notre{' '}
        <a href="#" className="text-[#2196F3] underline">Politique de Confidentialité</a>.
      </p>

      <div className="mt-8 flex items-center gap-2 text-gray-400 text-sm">
        <span>Raccourcis clavier:</span>
        <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+Z</kbd>
        <span>Annuler</span>
        <kbd className="px-2 py-1 bg-gray-100 rounded ml-2">Ctrl+Y</kbd>
        <span>Rétablir</span>
      </div>
    </div>
  );
}
