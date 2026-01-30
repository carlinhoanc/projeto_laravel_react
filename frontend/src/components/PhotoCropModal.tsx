import React, { useState, useCallback, useRef, useEffect } from 'react';

interface PhotoCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImage: Blob) => void;
  imageFile: File | null;
}

const CROP_SIZE = 300;

export default function PhotoCropModal({
  isOpen,
  onClose,
  onCropComplete,
  imageFile,
}: PhotoCropModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
        setOffsetX(0);
        setOffsetY(0);
        setZoom(1);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      setImageNaturalSize({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - offsetX,
      y: e.clientY - offsetY,
    });
  }, [offsetX, offsetY]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    setOffsetX(e.clientX - dragStart.x);
    setOffsetY(e.clientY - dragStart.y);
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleCrop = useCallback(async () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;

    // Calcular a posição da imagem e seu tamanho renderizado
    const renderedWidth = img.width;
    const renderedHeight = img.height;
    
    // Converter offset de pixels do container para coordenadas da imagem
    const sourceX = Math.max(0, (-offsetX / renderedWidth) * imageNaturalSize.width);
    const sourceY = Math.max(0, (-offsetY / renderedHeight) * imageNaturalSize.height);
    
    // O tamanho da área que queremos pegar
    const sourceWidth = (CROP_SIZE / renderedWidth) * imageNaturalSize.width;
    const sourceHeight = (CROP_SIZE / renderedHeight) * imageNaturalSize.height;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar a área cropada
    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      CROP_SIZE,
      CROP_SIZE
    );

    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob);
        handleClose();
      }
    }, 'image/jpeg', 0.9);
  }, [offsetX, offsetY, imageNaturalSize, onCropComplete]);

  const handleClose = () => {
    setImageSrc(null);
    setOffsetX(0);
    setOffsetY(0);
    setZoom(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Cortar Foto (Quadrado)</h2>

        {imageSrc && (
          <div className="space-y-4">
            {/* Container da imagem com crop quadrado */}
            <div
              ref={containerRef}
              className="relative mx-auto border-2 border-gray-300 rounded bg-gray-900 overflow-hidden cursor-move select-none"
              style={{
                width: `${CROP_SIZE}px`,
                height: `${CROP_SIZE}px`,
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Imagem com transformações */}
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                onLoad={handleImageLoad}
                style={{
                  transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
                  transformOrigin: '0 0',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  cursor: isDragging ? 'grabbing' : 'grab',
                }}
                draggable={false}
              />

              {/* Grid para visualizar */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="border border-white border-opacity-20"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Controle de zoom */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Zoom: {zoom.toFixed(2)}x
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Arraste a imagem para posicionar. Use o zoom para aumentar/diminuir.
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrop}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}

        {!imageSrc && (
          <div className="text-center py-8 text-gray-600">
            Carregando imagem...
          </div>
        )}

        {/* Canvas oculto para o crop final */}
        <canvas ref={canvasRef} width={CROP_SIZE} height={CROP_SIZE} className="hidden" />
      </div>
    </div>
  );
}
