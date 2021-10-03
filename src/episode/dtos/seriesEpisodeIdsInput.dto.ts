import {BuyEpisodeInput} from "./buyEpisodeInput.dto";
import {InputType} from "@nestjs/graphql";

@InputType()
export class seriesEpisodeIdsInput extends BuyEpisodeInput {}