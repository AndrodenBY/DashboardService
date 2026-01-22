import {SubscriptionType} from "../modules/types/enums/SubscriptionType.ts";
import {SubscriptionContent} from "../modules/types/enums/SubscriptionContent.ts";
import {Card, CardContent, Divider, Stack, Typography} from "@mui/material";

type StartPageProps = {
  subscriptionName: string;
  subscriptionType: SubscriptionType;
  subscriptionContent: SubscriptionContent;
};

export function SubscriptionCard ({subscriptionName, subscriptionType, subscriptionContent}: StartPageProps) {

  return (
      <Card variant="outlined">
        <Stack direction="row" sx={{justifyContent: 'space-between', alignItems: 'center', padding: '10px'}}>
          <Typography gutterBottom variant="h4" component="div">
            {subscriptionName}
          </Typography>
          <Typography gutterBottom component="div" sx={{color: 'text.secondary'}}>
            {subscriptionType}
          </Typography>
        </Stack>
        <Divider />
        <CardContent>
          <Stack direction="column" spacing={1}>
            <Typography variant="body2" sx={{color: 'text.secondary'}}>Type of content: {subscriptionContent}</Typography>
          </Stack>
        </CardContent>
      </Card>
  );
}



