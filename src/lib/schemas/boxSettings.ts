import { z } from 'zod';

export const boxSettingsSchema = z.object({
	intervals: z.array(z.number().positive()),
	when_wrong: z.enum(['back', 'to_first'])
});

export type BoxSettings = z.infer<typeof boxSettingsSchema>;
