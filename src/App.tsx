import './App.css';
import {SubscriptionCard} from "./components/SubscriptionCard.tsx";
import {subscriptionApiCalls} from "./api/calls/subscriptionApiCalls.ts";
import {useEffect, useState} from "react";
import type {
  SubscriptionViewModel
} from "./modules/types/subscription/view-model/subscription/SubscriptionViewModel.ts";
import {SubscriptionList} from "./components/SubscriptionList.tsx";
import "./index.css"

type HomePageProps = {
  children?: React.ReactNode;
};

const HomePage: React.FC<HomePageProps> = ({ children }) => {
  return <div className="homepage">{children}</div>;
};

function App() {
  const [subscription, setSubscription] = useState<SubscriptionViewModel | null>(null);
  const [showSub, setShowSub] = useState(false);

  const [subscriptionList, setSubscriptionList] = useState<SubscriptionViewModel[] | null>([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      const subscriptionListData = await subscriptionApiCalls.getAll();
      setSubscriptionList(subscriptionListData);

      const subscriptionData = await subscriptionApiCalls.getById("019a0bb8-ffa5-73cc-91ad-fc86c0a3404d");
      setSubscription(subscriptionData);
    };

    fetchSubscription();
  }, []);

  return (
    <div>
      <HomePage>
        <button onClick={() => setShowList(!showList)}>
          BAM
        </button>
        <button onClick={() => setShowSub(!showSub)}>
          BAMx2
        </button>
        <div>
          { showSub && (
            <div>
              {subscription && (
                <SubscriptionCard
                  subscriptionName={subscription.name}
                  subscriptionType={subscription.type}
                  subscriptionContent={subscription.content}
                />
              )}
            </div>
          )}
        </div>
        { showList && (
          <div>
            {subscriptionList && subscriptionList.map(subscriptionItem => (
              <SubscriptionList
                key={subscriptionItem.id}
                subscriptionName={subscriptionItem.name}
                subscriptionType={subscriptionItem.type}
                subscriptionContent={subscriptionItem.content}
              />
            ))}
          </div>
        )}

      </HomePage>
    </div>
  );
}

export default App;
