import React, { useState } from 'react';
import { RefreshCw, Copy, Check, ShieldCheck, Key, Sparkles, Sliders } from 'lucide-react';
import { authService } from '../services/AuthService';
import { PasswordGeneratorOptions } from '../types/auth';

interface PasswordGeneratorBoxProps {
  onSelectPassword?: (password: string) => void;
  className?: string;
}

export const PasswordGeneratorBox: React.FC<PasswordGeneratorBoxProps> = ({
  onSelectPassword,
  className = '',
}) => {
  const [options, setOptions] = useState<PasswordGeneratorOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });

  const [generatedPassword, setGeneratedPassword] = useState<string>(() =>
    authService.generateStrongPassword(options)
  );

  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleGenerate = () => {
    const pwd = authService.generateStrongPassword(options);
    setGeneratedPassword(pwd);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUsePassword = () => {
    handleCopy();
    if (onSelectPassword) {
      onSelectPassword(generatedPassword);
    }
  };

  const strength = authService.calculateStrength(generatedPassword);

  return (
    <div className={`bg-[#0a0a0f] border border-[#e8c872]/40 rounded-2xl p-4 space-y-3.5 shadow-lg text-left ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e8c872]">
          <Key className="w-3.5 h-3.5" />
          <span>Cryptographic Password Generator</span>
        </div>
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="text-[11px] text-[#a8a7b3] hover:text-white flex items-center gap-1 cursor-pointer"
        >
          <Sliders className="w-3 h-3" />
          <span>{showOptions ? 'Hide Settings' : 'Customize'}</span>
        </button>
      </div>

      {/* Password Display Field */}
      <div className="flex items-center gap-2 bg-[#14141d] border border-[#2a2a38] rounded-xl p-2.5">
        <div className="flex-1 font-mono text-xs sm:text-sm text-emerald-400 font-bold tracking-wider truncate select-all px-1">
          {generatedPassword}
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          title="Regenerate Password"
          className="p-1.5 rounded-lg text-[#a8a7b3] hover:text-white hover:bg-[#2a2a38] transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleCopy}
          title="Copy Password"
          className="p-1.5 rounded-lg text-[#a8a7b3] hover:text-white hover:bg-[#2a2a38] transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Strength & Entropy Indicator */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#a8a7b3]">Strength:</span>
          <span className="font-bold font-mono" style={{ color: strength.color }}>
            {strength.label} ({strength.score}/4)
          </span>
        </div>
        <div className="w-full bg-[#14141d] h-1.5 rounded-full overflow-hidden flex gap-1">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className="h-full flex-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor: step <= strength.score ? strength.color : '#2a2a38',
              }}
            />
          ))}
        </div>
      </div>

      {/* Options Dropdown */}
      {showOptions && (
        <div className="pt-2 border-t border-[#2a2a38] space-y-3 text-xs text-[#a8a7b3] animate-in fade-in duration-200">
          <div>
            <div className="flex justify-between mb-1">
              <span>Length: {options.length} characters</span>
            </div>
            <input
              type="range"
              min={8}
              max={32}
              value={options.length}
              onChange={(e) => {
                const len = parseInt(e.target.value, 10);
                const newOpt = { ...options, length: len };
                setOptions(newOpt);
                setGeneratedPassword(authService.generateStrongPassword(newOpt));
              }}
              className="w-full accent-[#e8c872] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeUppercase}
                onChange={(e) => {
                  const newOpt = { ...options, includeUppercase: e.target.checked };
                  setOptions(newOpt);
                  setGeneratedPassword(authService.generateStrongPassword(newOpt));
                }}
                className="accent-[#e8c872]"
              />
              <span>Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeLowercase}
                onChange={(e) => {
                  const newOpt = { ...options, includeLowercase: e.target.checked };
                  setOptions(newOpt);
                  setGeneratedPassword(authService.generateStrongPassword(newOpt));
                }}
                className="accent-[#e8c872]"
              />
              <span>Lowercase (a-z)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) => {
                  const newOpt = { ...options, includeNumbers: e.target.checked };
                  setOptions(newOpt);
                  setGeneratedPassword(authService.generateStrongPassword(newOpt));
                }}
                className="accent-[#e8c872]"
              />
              <span>Numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) => {
                  const newOpt = { ...options, includeSymbols: e.target.checked };
                  setOptions(newOpt);
                  setGeneratedPassword(authService.generateStrongPassword(newOpt));
                }}
                className="accent-[#e8c872]"
              />
              <span>Symbols (!@#$)</span>
            </label>
          </div>
        </div>
      )}

      {/* Quick Use Button */}
      {onSelectPassword && (
        <button
          type="button"
          onClick={handleUsePassword}
          className="w-full py-2 rounded-xl bg-[#e8c872]/15 hover:bg-[#e8c872]/25 border border-[#e8c872]/40 text-[#e8c872] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Apply This Password to Form</span>
        </button>
      )}
    </div>
  );
};
