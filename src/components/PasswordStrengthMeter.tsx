import { Progress } from "@/components/ui/progress";
import { getPasswordStrength } from "@/utils/security";

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  if (!password) return null;
  
  const { strength, label, color } = getPasswordStrength(password);
  const progressValue = (strength / 6) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Password strength:</span>
        <span className={`font-medium ${
          color === 'destructive' ? 'text-destructive' :
          color === 'warning' ? 'text-amber-600' :
          'text-green-600'
        }`}>
          {label}
        </span>
      </div>
      <Progress 
        value={progressValue} 
        className={`h-2 ${
          color === 'destructive' ? '[&>div]:bg-destructive' :
          color === 'warning' ? '[&>div]:bg-amber-500' :
          '[&>div]:bg-green-500'
        }`}
      />
    </div>
  );
};