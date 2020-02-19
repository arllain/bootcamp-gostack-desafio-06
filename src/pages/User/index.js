import React, { Component } from 'react';
import api from '../../services/api';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  LoadingIndicator,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 1,
  };

  componentDidMount() {
    this.loadRepositories();
  }

  loadRepositories = async () => {
    if (this.state.loading) return;

    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { page } = this.state;
    this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    if (response) {
    }

    this.setState({
      stars: [...this.state.stars, ...response.data],
      loading: false,
      page: page + 1,
    });
  };

  renderFooter = () => {
    if (!this.state.loading) return null;
    return (
      <LoadingIndicator>
        <ActivityIndicator size="large" color="#7159c1" />
      </LoadingIndicator>
    );
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading } = this.state;
    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        <Stars
          onEndReached={this.loadRepositories} // Função que carrega mais itens
          onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
          ListFooterComponent={this.renderFooter}
        />
      </Container>
    );
  }
}
