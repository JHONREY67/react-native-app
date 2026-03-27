import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

const FOOD_DATA = [
  {
    id: 1,
    name: 'Cheese Burger',
    price: 180,
    category: 'Burger',
    rating: 4.8,
    time: '15 min',
    description: 'Juicy burger with cheese, lettuce, and special sauce.',
    image: 'https://i.pinimg.com/1200x/9e/8b/6e/9e8b6ed6ee305de7e556f0480b7443b5.jpg',
  },
  {
    id: 2,
    name: 'Double Burger',
    price: 220,
    category: 'Burger',
    rating: 4.9,
    time: '18 min',
    description: 'A loaded double burger perfect for big cravings.',
    image: 'https://i.pinimg.com/1200x/4d/a7/3f/4da73f313deef52c2373795a970b4082.jpg',
  },
  {
    id: 3,
    name: 'Chicken Burger',
    price: 190,
    category: 'Chicken',
    rating: 4.7,
    time: '16 min',
    description: 'Crispy chicken burger with creamy mayo.',
    image: 'https://i.pinimg.com/736x/36/2d/ba/362dba23d559f0d2945f0ea687169f33.jpg',
  },
  {
    id: 4,
    name: 'Mega Burger',
    price: 260,
    category: 'Burger',
    rating: 4.9,
    time: '20 min',
    description: 'Big burger with fresh vegetables and tasty beef patty.',
    image: 'https://i.pinimg.com/1200x/7b/4a/7b/7b4a7b7b8a27156282304bc0ee6ce53e.jpg',
  },
];

const CATEGORIES = ['All', 'Burger', 'Chicken'];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const filteredFoods = useMemo(() => {
    return FOOD_DATA.filter((item) => {
      const matchCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, search]);

  const addToCart = (food) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });

    Alert.alert('Added to Cart', `${food.name} added successfully.`);
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const toggleFavorite = (food) => {
    const exists = favorites.find((item) => item.id === food.id);
    if (exists) {
      setFavorites((prev) => prev.filter((item) => item.id !== food.id));
    } else {
      setFavorites((prev) => [...prev, food]);
    }
  };

  const isFavorite = (id) => favorites.some((item) => item.id === id);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const FoodCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedFood(item);
        setActiveTab('details');
      }}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />

      <TouchableOpacity
        style={styles.favoriteBtn}
        onPress={() => toggleFavorite(item)}
      >
        <Text style={styles.favoriteText}>
          {isFavorite(item.id) ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.cardName}>{item.name}</Text>
      <Text style={styles.cardSub}>
        {item.category} • ⭐ {item.rating} • {item.time}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.cardPrice}>₱{item.price}</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderHome = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Gab 👋</Text>
          <Text style={styles.subtitle}>Order your favorite burger today</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>G</Text>
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search burgers..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.banner}>
        <View style={styles.bannerLeft}>
          <Text style={styles.sale}>50% OFF</Text>
          <Text style={styles.bannerText}>Special burger deals for today only.</Text>
          <TouchableOpacity style={styles.orderBtn}>
            <Text style={styles.orderBtnText}>Order now</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={{
            uri: 'https://i.pinimg.com/1200x/9e/8b/6e/9e8b6ed6ee305de7e556f0480b7443b5.jpg',
          }}
          style={styles.bannerImage}
        />
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryRow}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryChip,
              selectedCategory === cat && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>Popular Items</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>

      <View style={styles.grid}>
        {filteredFoods.map((item) => (
          <FoodCard key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  );

  const renderDetails = () => {
    if (!selectedFood) {
      return (
        <View style={styles.centerPage}>
          <Text style={styles.emptyTitle}>No item selected</Text>
        </View>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: selectedFood.image }} style={styles.detailsImage} />

        <View style={styles.detailsBox}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setActiveTab('home')}
          >
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.detailsTopRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailsName}>{selectedFood.name}</Text>
              <Text style={styles.detailsInfo}>
                {selectedFood.category} • ⭐ {selectedFood.rating} • {selectedFood.time}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.favoriteBtnLarge}
              onPress={() => toggleFavorite(selectedFood)}
            >
              <Text style={styles.favoriteText}>
                {isFavorite(selectedFood.id) ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.detailsPrice}>₱{selectedFood.price}</Text>
          <Text style={styles.detailsDesc}>{selectedFood.description}</Text>

          <TouchableOpacity
            style={styles.bigActionBtn}
            onPress={() => addToCart(selectedFood)}
          >
            <Text style={styles.bigActionBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderFavorites = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.sectionTitle}>Favorites</Text>

      {favorites.length === 0 ? (
        <View style={styles.centerPage}>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyText}>Tap the heart icon to save foods here.</Text>
        </View>
      ) : (
        favorites.map((item) => (
          <View key={item.id} style={styles.listCard}>
            <Image source={{ uri: item.image }} style={styles.listImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.listName}>{item.name}</Text>
              <Text style={styles.listSub}>{item.category}</Text>
              <Text style={styles.listPrice}>₱{item.price}</Text>
            </View>
            <TouchableOpacity
              style={styles.smallOutlineBtn}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.smallOutlineText}>Add</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );

  const renderCart = () => (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>My Cart</Text>

        {cart.length === 0 ? (
          <View style={styles.centerPage}>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>Add some burgers first.</Text>
          </View>
        ) : (
          cart.map((item) => (
            <View key={item.id} style={styles.listCard}>
              <Image source={{ uri: item.image }} style={styles.listImage} />

              <View style={{ flex: 1 }}>
                <Text style={styles.listName}>{item.name}</Text>
                <Text style={styles.listSub}>₱{item.price} each</Text>
                <Text style={styles.listPrice}>
                  Subtotal: ₱{item.price * item.quantity}
                </Text>
              </View>

              <View style={styles.qtyBox}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => decreaseQty(item.id)}
                >
                  <Text style={styles.qtyText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.qtyNumber}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => increaseQty(item.id)}
                >
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {cart.length > 0 && (
        <View style={styles.checkoutBar}>
          <View>
            <Text style={styles.checkoutLabel}>Total</Text>
            <Text style={styles.checkoutPrice}>₱{cartTotal}</Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => Alert.alert('Order Placed', 'Your order has been submitted.')}
          >
            <Text style={styles.checkoutBtnText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderProfile = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>G</Text>
        </View>
        <Text style={styles.profileName}>Gab</Text>
        <Text style={styles.profileEmail}>gab@example.com</Text>
      </View>

      <View style={styles.profileMenu}>
        <View style={styles.profileItem}>
          <Text style={styles.profileItemText}>My Orders</Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.profileItemText}>Delivery Address</Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.profileItemText}>Payment Method</Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.profileItemText}>Settings</Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.profileItemText}>Help Center</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderScreen = () => {
    if (activeTab === 'home') return renderHome();
    if (activeTab === 'details') return renderDetails();
    if (activeTab === 'favorites') return renderFavorites();
    if (activeTab === 'cart') return renderCart();
    if (activeTab === 'profile') return renderProfile();
    return renderHome();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>

      {activeTab !== 'details' && (
        <View style={styles.bottomTab}>
          <TouchableOpacity onPress={() => setActiveTab('home')}>
            <Text style={[styles.tabIcon, activeTab === 'home' && styles.tabActive]}>⌂</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab('favorites')}>
            <Text style={[styles.tabIcon, activeTab === 'favorites' && styles.tabActive]}>♥</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab('cart')}>
            <View>
              <Text style={[styles.tabIcon, activeTab === 'cart' && styles.tabActive]}>🛒</Text>
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab('profile')}>
            <Text style={[styles.tabIcon, activeTab === 'profile' && styles.tabActive]}>👤</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    padding: 18,
    paddingBottom: 100,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f1f1f',
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#b30000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },

  banner: {
    backgroundColor: '#b30000',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  bannerLeft: {
    flex: 1,
    paddingRight: 10,
  },

  sale: {
    color: '#ffcf33',
    fontSize: 28,
    fontWeight: 'bold',
  },

  bannerText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 12,
  },

  orderBtn: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  orderBtnText: {
    color: '#b30000',
    fontWeight: 'bold',
  },

  bannerImage: {
    width: 110,
    height: 110,
    borderRadius: 18,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },

  categoryRow: {
    marginBottom: 20,
  },

  categoryChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ececec',
  },

  categoryChipActive: {
    backgroundColor: '#b30000',
  },

  categoryText: {
    color: '#444',
    fontWeight: '600',
  },

  categoryTextActive: {
    color: '#fff',
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  seeAll: {
    color: '#b30000',
    fontWeight: 'bold',
    marginTop: 4,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 18,
    padding: 10,
    marginBottom: 14,
    elevation: 3,
    position: 'relative',
  },

  cardImage: {
    width: '100%',
    height: 110,
    borderRadius: 14,
    marginBottom: 8,
  },

  favoriteBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffffdd',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },

  favoriteBtnLarge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  favoriteText: {
    color: '#b30000',
    fontSize: 18,
    fontWeight: 'bold',
  },

  cardName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },

  cardSub: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardPrice: {
    color: '#b30000',
    fontSize: 16,
    fontWeight: 'bold',
  },

  addBtn: {
    backgroundColor: '#b30000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },

  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  detailsImage: {
    width: '100%',
    height: 300,
  },

  detailsBox: {
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: 350,
  },

  backBtn: {
    marginBottom: 16,
  },

  backBtnText: {
    color: '#b30000',
    fontSize: 16,
    fontWeight: 'bold',
  },

  detailsTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  detailsName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },

  detailsInfo: {
    color: '#666',
    marginTop: 6,
  },

  detailsPrice: {
    color: '#b30000',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 18,
  },

  detailsDesc: {
    color: '#444',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
    marginBottom: 24,
  },

  bigActionBtn: {
    backgroundColor: '#b30000',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },

  bigActionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  listCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 18,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
  },

  listImage: {
    width: 75,
    height: 75,
    borderRadius: 14,
    marginRight: 12,
  },

  listName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },

  listSub: {
    color: '#666',
    marginTop: 4,
    fontSize: 13,
  },

  listPrice: {
    color: '#b30000',
    marginTop: 6,
    fontWeight: 'bold',
  },

  smallOutlineBtn: {
    borderWidth: 1,
    borderColor: '#b30000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },

  smallOutlineText: {
    color: '#b30000',
    fontWeight: 'bold',
  },

  qtyBox: {
    alignItems: 'center',
    marginLeft: 8,
  },

  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#b30000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  qtyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  qtyNumber: {
    marginVertical: 6,
    fontWeight: 'bold',
    fontSize: 16,
  },

  checkoutBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  checkoutLabel: {
    color: '#666',
    fontSize: 13,
  },

  checkoutPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b30000',
  },

  checkoutBtn: {
    backgroundColor: '#b30000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 18,
  },

  checkoutBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  centerPage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },

  emptyText: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  },

  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },

  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#b30000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  profileAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 28,
  },

  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },

  profileEmail: {
    color: '#777',
    marginTop: 6,
  },

  profileMenu: {
    backgroundColor: '#fff',
    borderRadius: 22,
    overflow: 'hidden',
  },

  profileItem: {
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },

  profileItemText: {
    fontSize: 16,
    color: '#222',
  },

  bottomTab: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
    backgroundColor: '#b30000',
    height: 64,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  tabIcon: {
    color: '#fff',
    fontSize: 22,
  },

  tabActive: {
    fontSize: 26,
    fontWeight: 'bold',
  },

  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#ffcf33',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#222',
  },
});