import { TrendingUp, ShoppingCart, Package, Users} from "lucide-react";
import StatCard from "./StatCard";
import SalesChart from "./SalesChart";
import TopProducts from "./TopProducts";
import RecentOrders from "./RecentOrders";

export default function AdminHome() {
    return (
        <div className="space-y-8 p-3">

            <div>
                <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="text-gray-600 mt-2">Bienvenue! Voici un apercu de votre activite </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Ventes totales"
                    value="1000F CFA"
                    change={12.5}
                    icon={TrendingUp}
                    color="emerald"
                    subtitle="Ce mois"
                />

                <StatCard
                    title="Commandes"
                    value="1,245"
                    change={8.2}
                    icon={ShoppingCart}
                    color="blue"
                    subtitle="Total cette année"
                />

                <StatCard
                    title="Produits"
                    value="482"
                    change={-2.3}
                    icon={Package}
                    color="amber"
                    subtitle="En stock"
                />

                <StatCard
                    title="Clients"
                    value="3,892"
                    change={15.8}
                    icon={Users}
                    color="purple"
                     subtitle="Utilisateurs actifs"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SalesChart />
                <TopProducts />
            </div>

            <RecentOrders />
        </div>
    );
}