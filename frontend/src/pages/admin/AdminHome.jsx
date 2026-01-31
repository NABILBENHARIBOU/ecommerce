import { TrendingUp, ShoppingCart, Package, Users} from "lucide-react";
import { useEffect, useState } from 'react'
import StatCard from "./StatCard";
import SalesChart from "./SalesChart";
import TopProducts from "./TopProducts";
import RecentOrders from "./RecentOrders";
import api from '../../services/api'

export default function AdminHome() {
    const [productsCount, setProductsCount] = useState(0)
    const [ordersCount, setOrdersCount] = useState(0)
    const [clientsCount, setClientsCount] = useState(0)
    const [salesTotal, setSalesTotal] = useState(0)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [products, orders, users] = await Promise.all([
                    api.getAllProducts(),
                    api.getAllOrders(),
                    api.getAllUsers(),
                ])

                setProductsCount(products ? products.length : 0)
                setOrdersCount(orders ? orders.length : 0)
                setClientsCount(users ? users.length : 0)

                const total = (orders || []).reduce((s, o) => {
                    const t = parseFloat(o.total || o.montant || 0)
                    return s + (isNaN(t) ? 0 : t)
                }, 0)
                setSalesTotal(total)
            } catch (err) {
                console.error('Erreur en récupérant les stats admin:', err)
            }
        }
        fetchStats()
    }, [])

    return (
        <div className="space-y-8 p-3">

            <div>
                <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="text-gray-600 mt-2">Bienvenue! Voici un aperçu de votre activité</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Ventes totales"
                    value={`${salesTotal.toFixed(2)} €`}
                    change={0}
                    icon={TrendingUp}
                    color="emerald"
                    subtitle="Total des ventes"
                />

                <StatCard
                    title="Commandes"
                    value={ordersCount.toLocaleString()}
                    change={0}
                    icon={ShoppingCart}
                    color="blue"
                    subtitle="Total de commandes"
                />

                <StatCard
                    title="Produits"
                    value={productsCount.toLocaleString()}
                    change={0}
                    icon={Package}
                    color="amber"
                    subtitle="Nombre total"
                />

                <StatCard
                    title="Clients"
                    value={clientsCount.toLocaleString()}
                    change={0}
                    icon={Users}
                    color="purple"
                     subtitle="Utilisateurs"
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