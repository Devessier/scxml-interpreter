import { InjectionKey, provide, inject } from "vue";
import { useInterpret } from "@xstate/vue";
import { appMachine, AppMachineInterpret } from "@/machines/app";

const MachineContextSymbol: InjectionKey<{
  appService: AppMachineInterpret;
}> = Symbol();

export function useAppInterpreterProvider() {
  const appService = useInterpret(appMachine);

  provide(MachineContextSymbol, {
    appService,
  });
}

export function useAppInterpreter() {
  const context = inject(MachineContextSymbol);
  if (context === undefined) {
    throw new Error(
      "useAppInterpreterProvider must be called before useAppInterpreter"
    );
  }

  return context;
}
