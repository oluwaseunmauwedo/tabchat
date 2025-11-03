import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup } from "./ui/select";
import { chatModel } from "@imageflow/convex/chatModel";
import { cn } from "@/lib/utils";

const PROVIDER_LABELS: Record<string, string> = {
    openai: "OpenAI",
    anthropic: "Anthropic",
    google: "Google",
    xai: "xAI",
    zai: "Zai",
    deepseek: "DeepSeek",
    perplexity: "Perplexity",
};

function getProvider(id: string) {
    const provider = id.split("/")[0] || "other";
    return provider in PROVIDER_LABELS ? provider : "other";
}

type ModelOption = (typeof chatModel)[number];

export default function ChatModelSelector({ model, setModel }: { model: string; setModel: (model: string) => void }) {
    const selectedModelData = chatModel.find((m) => m.id === model);

    // Group models by provider while preserving their original order
    const groups = chatModel.reduce<Record<string, ModelOption[]>>((acc, m) => {
        const provider = getProvider(m.id);
        if (!acc[provider]) acc[provider] = [] as ModelOption[];
        acc[provider].push(m);
        return acc;
    }, {} as Record<string, ModelOption[]>);

    const providersOrder = chatModel
        .map((m) => getProvider(m.id))
        .filter((p, idx, arr) => arr.indexOf(p) === idx);

    return (
        <Select value={model} onValueChange={(value) => setModel(value)}>
            <SelectTrigger
                size="sm"
                className={cn(
                    "h-8 px-3 text-xs font-medium rounded-xl shadow-xs bg-transparent !border-0 hover:bg-transparent",
                    "focus-visible:border-0 focus-visible:ring-0"
                )}
            >
                <SelectValue>
                    <span className="truncate max-w-[12rem]">
                        {selectedModelData?.name || "Select model"}
                    </span>
                </SelectValue>
            </SelectTrigger>
            <SelectContent className="w-[320px] max-w-[calc(100vw-2rem)] md:w-[480px] max-h-[80vh] overflow-y-auto rounded-xl">
                {providersOrder.map((provider, pIdx) => (
                    <div key={provider}>
                        <SelectGroup>
                            <SelectLabel className="px-2 py-1.5 text-[11px] tracking-wide uppercase">
                                {PROVIDER_LABELS[provider] || provider}
                            </SelectLabel>

                            <div className="grid grid-cols-2 gap-2 p-2">
                                {groups[provider]?.map((modelOption) => (
                                    <SelectItem
                                        key={modelOption.id}
                                        value={modelOption.id}
                                        className={cn(
                                            "w-auto h-auto min-h-[80px] items-start justify-start rounded-lg border bg-card/70 hover:bg-card py-2.5 pr-8 pl-2.5 text-left",
                                            "transition-[background,box-shadow,border-color] border-border/60 hover:border-border shadow-xs hover:shadow-sm",
                                            "data-[state=checked]:ring-1 data-[state=checked]:ring-ring data-[highlighted]:border-primary/30"
                                        )}
                                    >
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-sm font-medium leading-none">{modelOption.name}</span>
                                            {modelOption.description ? (
                                                <span className="text-xs text-muted-foreground leading-relaxed line-clamp-3 text-pretty">
                                                    {modelOption.description}
                                                </span>
                                            ) : null}
                                        </div>
                                    </SelectItem>
                                ))}
                            </div>
                        </SelectGroup>
                        {pIdx < providersOrder.length - 1 ? <div className="h-2" /> : null}
                    </div>
                ))}
            </SelectContent>
        </Select>
    );
}